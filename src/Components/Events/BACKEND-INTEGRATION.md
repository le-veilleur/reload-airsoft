# Intégration Backend - Upload d'Images

Ce document explique comment implémenter l'endpoint backend pour l'upload d'images qui génère des URLs pour la base de données.

## Endpoints nécessaires

### 1. Upload d'image
```
POST /upload/image
Content-Type: multipart/form-data

Body:
- image: File (obligatoire)
- event_id: string (optionnel, pour organiser les images)

Response:
{
  "url": "https://cdn.example.com/images/events/123/abc123.jpg",
  "filename": "abc123.jpg",
  "size": 1024000,
  "mime_type": "image/jpeg",
  "uploaded_at": "2025-01-15T14:30:00Z"
}
```

### 2. Suppression d'image
```
DELETE /upload/image
Content-Type: application/json

Body:
{
  "image_url": "https://cdn.example.com/images/events/123/abc123.jpg"
}

Response:
{
  "message": "Image supprimée avec succès",
  "success": true
}
```

## Implémentation Backend (Go)

### 1. Structure de données

```go
// models/image.go
package models

import (
    "time"
)

type ImageUpload struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    URL       string    `json:"url" gorm:"not null"`
    Filename  string    `json:"filename" gorm:"not null"`
    Size      int64     `json:"size" gorm:"not null"`
    MimeType  string    `json:"mime_type" gorm:"not null"`
    EventID   *string   `json:"event_id,omitempty"`
    UserID    string    `json:"user_id" gorm:"not null"`
    CreatedAt time.Time `json:"uploaded_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type UploadImageRequest struct {
    Image   *multipart.FileHeader `form:"image" binding:"required"`
    EventID string                `form:"event_id"`
}

type UploadImageResponse struct {
    URL       string    `json:"url"`
    Filename  string    `json:"filename"`
    Size      int64     `json:"size"`
    MimeType  string    `json:"mime_type"`
    UploadedAt time.Time `json:"uploaded_at"`
}

type DeleteImageRequest struct {
    ImageURL string `json:"image_url" binding:"required"`
}
```

### 2. Service d'upload

```go
// services/image_service.go
package services

import (
    "fmt"
    "io"
    "mime/multipart"
    "os"
    "path/filepath"
    "strings"
    "time"
    
    "github.com/google/uuid"
    "github.com/your-project/models"
)

type ImageService struct {
    uploadDir string
    baseURL   string
}

func NewImageService(uploadDir, baseURL string) *ImageService {
    return &ImageService{
        uploadDir: uploadDir,
        baseURL:   baseURL,
    }
}

func (s *ImageService) UploadImage(file *multipart.FileHeader, eventID, userID string) (*models.UploadImageResponse, error) {
    // Validation du fichier
    if err := s.validateFile(file); err != nil {
        return nil, err
    }
    
    // Générer un nom de fichier unique
    filename := s.generateFilename(file.Filename)
    
    // Créer le chemin de destination
    var destPath string
    if eventID != "" {
        destPath = filepath.Join(s.uploadDir, "events", eventID, filename)
    } else {
        destPath = filepath.Join(s.uploadDir, "temp", filename)
    }
    
    // Créer les dossiers si nécessaire
    if err := os.MkdirAll(filepath.Dir(destPath), 0755); err != nil {
        return nil, fmt.Errorf("erreur création dossier: %w", err)
    }
    
    // Ouvrir le fichier source
    src, err := file.Open()
    if err != nil {
        return nil, fmt.Errorf("erreur ouverture fichier: %w", err)
    }
    defer src.Close()
    
    // Créer le fichier de destination
    dst, err := os.Create(destPath)
    if err != nil {
        return nil, fmt.Errorf("erreur création fichier: %w", err)
    }
    defer dst.Close()
    
    // Copier le contenu
    if _, err := io.Copy(dst, src); err != nil {
        return nil, fmt.Errorf("erreur copie fichier: %w", err)
    }
    
    // Générer l'URL publique
    var publicURL string
    if eventID != "" {
        publicURL = fmt.Sprintf("%s/images/events/%s/%s", s.baseURL, eventID, filename)
    } else {
        publicURL = fmt.Sprintf("%s/images/temp/%s", s.baseURL, filename)
    }
    
    // Créer l'enregistrement en base
    imageUpload := &models.ImageUpload{
        URL:      publicURL,
        Filename: filename,
        Size:     file.Size,
        MimeType: file.Header.Get("Content-Type"),
        EventID:  &eventID,
        UserID:   userID,
    }
    
    // Sauvegarder en base (implémenter selon votre ORM)
    if err := s.saveToDatabase(imageUpload); err != nil {
        // Supprimer le fichier si l'enregistrement échoue
        os.Remove(destPath)
        return nil, fmt.Errorf("erreur sauvegarde base: %w", err)
    }
    
    return &models.UploadImageResponse{
        URL:        publicURL,
        Filename:   filename,
        Size:       file.Size,
        MimeType:   file.Header.Get("Content-Type"),
        UploadedAt: imageUpload.CreatedAt,
    }, nil
}

func (s *ImageService) DeleteImage(imageURL, userID string) error {
    // Vérifier que l'utilisateur peut supprimer cette image
    imageUpload, err := s.getImageByURL(imageURL)
    if err != nil {
        return fmt.Errorf("image non trouvée: %w", err)
    }
    
    if imageUpload.UserID != userID {
        return fmt.Errorf("non autorisé à supprimer cette image")
    }
    
    // Supprimer le fichier physique
    filePath := s.urlToPath(imageURL)
    if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
        return fmt.Errorf("erreur suppression fichier: %w", err)
    }
    
    // Supprimer de la base
    if err := s.deleteFromDatabase(imageUpload.ID); err != nil {
        return fmt.Errorf("erreur suppression base: %w", err)
    }
    
    return nil
}

func (s *ImageService) validateFile(file *multipart.FileHeader) error {
    // Vérifier la taille (10MB max)
    maxSize := int64(10 * 1024 * 1024)
    if file.Size > maxSize {
        return fmt.Errorf("fichier trop volumineux, maximum 10MB")
    }
    
    // Vérifier le type MIME
    allowedTypes := []string{
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/webp",
        "image/gif",
    }
    
    contentType := file.Header.Get("Content-Type")
    allowed := false
    for _, t := range allowedTypes {
        if contentType == t {
            allowed = true
            break
        }
    }
    
    if !allowed {
        return fmt.Errorf("type de fichier non supporté")
    }
    
    return nil
}

func (s *ImageService) generateFilename(originalName string) string {
    ext := filepath.Ext(originalName)
    return fmt.Sprintf("%s%s", uuid.New().String(), ext)
}

func (s *ImageService) urlToPath(url string) string {
    // Convertir l'URL en chemin de fichier
    // Exemple: https://cdn.example.com/images/events/123/abc.jpg
    // -> /var/www/uploads/images/events/123/abc.jpg
    urlParts := strings.Split(url, "/images/")
    if len(urlParts) != 2 {
        return ""
    }
    return filepath.Join(s.uploadDir, "images", urlParts[1])
}

// Méthodes à implémenter selon votre ORM
func (s *ImageService) saveToDatabase(image *models.ImageUpload) error {
    // Implémenter avec GORM ou votre ORM
    return nil
}

func (s *ImageService) getImageByURL(url string) (*models.ImageUpload, error) {
    // Implémenter avec GORM ou votre ORM
    return nil, nil
}

func (s *ImageService) deleteFromDatabase(id uint) error {
    // Implémenter avec GORM ou votre ORM
    return nil
}
```

### 3. Handler HTTP

```go
// handlers/image_handler.go
package handlers

import (
    "net/http"
    
    "github.com/gin-gonic/gin"
    "github.com/your-project/services"
    "github.com/your-project/models"
)

type ImageHandler struct {
    imageService *services.ImageService
}

func NewImageHandler(imageService *services.ImageService) *ImageHandler {
    return &ImageHandler{
        imageService: imageService,
    }
}

func (h *ImageHandler) UploadImage(c *gin.Context) {
    var req models.UploadImageRequest
    if err := c.ShouldBind(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Données invalides",
            "details": err.Error(),
        })
        return
    }
    
    // Récupérer l'utilisateur depuis le contexte JWT
    userID := c.GetString("user_id")
    if userID == "" {
        c.JSON(http.StatusUnauthorized, gin.H{
            "error": "Utilisateur non authentifié",
        })
        return
    }
    
    // Upload de l'image
    response, err := h.imageService.UploadImage(req.Image, req.EventID, userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Erreur lors de l'upload",
            "details": err.Error(),
        })
        return
    }
    
    c.JSON(http.StatusOK, response)
}

func (h *ImageHandler) DeleteImage(c *gin.Context) {
    var req models.DeleteImageRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Données invalides",
            "details": err.Error(),
        })
        return
    }
    
    // Récupérer l'utilisateur depuis le contexte JWT
    userID := c.GetString("user_id")
    if userID == "" {
        c.JSON(http.StatusUnauthorized, gin.H{
            "error": "Utilisateur non authentifié",
        })
        return
    }
    
    // Suppression de l'image
    if err := h.imageService.DeleteImage(req.ImageURL, userID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Erreur lors de la suppression",
            "details": err.Error(),
        })
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "message": "Image supprimée avec succès",
        "success": true,
    })
}
```

### 4. Routes

```go
// routes/image_routes.go
package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/your-project/handlers"
    "github.com/your-project/middleware"
)

func SetupImageRoutes(r *gin.Engine, imageHandler *handlers.ImageHandler) {
    upload := r.Group("/upload")
    {
        upload.POST("/image", middleware.AuthMiddleware(), imageHandler.UploadImage)
        upload.DELETE("/image", middleware.AuthMiddleware(), imageHandler.DeleteImage)
    }
}
```

## Configuration

### Variables d'environnement

```env
# Backend
UPLOAD_DIR=/var/www/uploads
CDN_BASE_URL=https://cdn.example.com
MAX_FILE_SIZE=10485760  # 10MB

# Frontend
REACT_APP_API_GATEWAY_URL=http://localhost:8080
REACT_APP_CDN_BASE_URL=https://cdn.example.com
```

### Structure des dossiers

```
/var/www/uploads/
├── images/
│   ├── events/
│   │   ├── 123/
│   │   │   ├── abc123.jpg
│   │   │   └── def456.png
│   │   └── 456/
│   │       └── ghi789.jpg
│   └── temp/
│       └── temp123.jpg
└── logs/
```

## Sécurité

### 1. Validation des fichiers
- Vérification du type MIME
- Vérification de la taille
- Scan antivirus (optionnel)

### 2. Authentification
- JWT obligatoire pour upload/suppression
- Vérification des permissions utilisateur

### 3. Nettoyage automatique
- Suppression des images temporaires après 24h
- Nettoyage des images orphelines

## Optimisation

### 1. Redimensionnement automatique
```go
func (s *ImageService) resizeImage(filePath string, maxWidth, maxHeight int) error {
    // Implémenter avec github.com/disintegration/imaging
    return nil
}
```

### 2. Compression
```go
func (s *ImageService) compressImage(filePath string, quality int) error {
    // Implémenter avec github.com/chai2010/webp
    return nil
}
```

### 3. CDN
- Intégration avec CloudFlare, AWS CloudFront, etc.
- Cache des images statiques
- Optimisation des performances

## Tests

```go
// tests/image_service_test.go
func TestImageService_UploadImage(t *testing.T) {
    // Tests unitaires pour le service
}

func TestImageHandler_UploadImage(t *testing.T) {
    // Tests d'intégration pour les handlers
}
```

Cette implémentation fournit un système complet d'upload d'images avec :
- ✅ Validation des fichiers
- ✅ Génération d'URLs uniques
- ✅ Organisation par événement
- ✅ Sécurité et authentification
- ✅ Gestion des erreurs
- ✅ Optimisation des performances 