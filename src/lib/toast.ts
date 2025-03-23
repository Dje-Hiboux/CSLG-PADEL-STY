/**
 * Utilitaire simple pour afficher des notifications toast
 * Utilise l'API native du navigateur pour les notifications
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

const showNotification = (message: string, type: ToastType) => {
  // Créer l'élément toast
  const toast = document.createElement('div');
  
  // Appliquer les styles de base
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '6px';
  toast.style.zIndex = '9999';
  toast.style.minWidth = '250px';
  toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  toast.style.transition = 'all 0.3s ease';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  
  // Appliquer les styles spécifiques au type
  switch (type) {
    case 'success':
      toast.style.backgroundColor = 'rgba(34, 197, 94, 0.9)';
      toast.style.color = '#fff';
      break;
    case 'error':
      toast.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
      toast.style.color = '#fff';
      break;
    case 'warning':
      toast.style.backgroundColor = 'rgba(245, 158, 11, 0.9)';
      toast.style.color = '#fff';
      break;
    case 'info':
    default:
      toast.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
      toast.style.color = '#fff';
      break;
  }
  
  // Définir le contenu
  toast.textContent = message;
  
  // Ajouter au DOM
  document.body.appendChild(toast);
  
  // Animation d'entrée
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  
  // Supprimer après 3 secondes
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    // Supprimer du DOM après la fin de l'animation
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

export const toast = {
  success: (message: string) => showNotification(message, 'success'),
  error: (message: string) => showNotification(message, 'error'),
  info: (message: string) => showNotification(message, 'info'),
  warning: (message: string) => showNotification(message, 'warning'),
};
