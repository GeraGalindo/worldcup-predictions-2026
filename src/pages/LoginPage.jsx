import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [configError, setConfigError] = useState(false);
  
  // Use ref to store callback so it doesn't cause re-initialization
  const callbackRef = useRef();

  // Helper function to parse JWT
  const parseJwt = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      throw error;
    }
  }, []);

  // Handle Google Sign-In response
  const handleCredentialResponse = useCallback(async (response) => {
    try {
      console.log('Received credential response');
      // Decode JWT token to get user info
      const userInfo = parseJwt(response.credential);
      
      // Now request access token with Sheets scope
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('OAuth error:', tokenResponse.error);
            alert('Error al obtener permisos: ' + tokenResponse.error);
            return;
          }
          
          if (!tokenResponse.access_token) {
            console.error('No access token received');
            alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
            return;
          }
          
          console.log('Received OAuth token');
          const userData = {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            accessToken: tokenResponse.access_token,
          };

          login(userData);
          navigate('/predictions');
        },
        error_callback: (error) => {
          console.error('Token request error:', error);
          alert('Error al solicitar permisos. Por favor, intenta de nuevo.');
        },
      });
      
      // Request access token with prompt to force consent screen
      console.log('Requesting access token...');
      tokenClient.requestAccessToken({ prompt: '' });
    } catch (error) {
      console.error('Error handling sign-in:', error);
      alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  }, [parseJwt, login, navigate]);
  
  // Update ref whenever callback changes
  useEffect(() => {
    callbackRef.current = handleCredentialResponse;
  }, [handleCredentialResponse]);

  useEffect(() => {
    // If already logged in, redirect to predictions
    if (user) {
      navigate('/predictions');
      return;
    }

    // Check if Client ID is configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
      setConfigError(true);
      setLoadingGoogle(false);
      return;
    }

    let mounted = true;
    let timeoutId = null;

    // Function to load Google Sign-In script dynamically
    const loadGoogleScript = () => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        // Check if script tag already exists
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          existingScript.onload = () => resolve();
          existingScript.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
          return;
        }

        // Create and inject script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Sign-In script loaded successfully');
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load Google Sign-In script from CDN');
          reject(new Error('Failed to load Google Sign-In script'));
        };
        document.head.appendChild(script);
      });
    };

    // Initialize Google Sign-In
    const initGoogleSignIn = async () => {
      if (!mounted) return;

      try {
        // Load the script first
        await loadGoogleScript();

        // Wait a bit for the script to fully initialize
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!mounted) return;

        const buttonDiv = document.getElementById('googleSignInButton');
        
        if (!buttonDiv) {
          console.error('Button div not found');
          if (mounted) {
            setConfigError(true);
            setLoadingGoogle(false);
          }
          return;
        }

        if (!window.google?.accounts?.id) {
          throw new Error('Google Sign-In API not available');
        }

        console.log('Initializing Google Sign-In...');
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => callbackRef.current?.(response),
        });

        window.google.accounts.id.renderButton(
          buttonDiv,
          { 
            theme: 'outline', 
            size: 'large',
            text: 'signin_with',
            locale: 'es',
          }
        );
        
        console.log('Google Sign-In initialized successfully');
        if (mounted) {
          setLoadingGoogle(false);
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        if (mounted) {
          setConfigError(true);
          setLoadingGoogle(false);
        }
      }
    };

    // Start initialization
    timeoutId = setTimeout(initGoogleSignIn, 100);

    // Cleanup function
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>⚽ Copa Mundial FIFA 2026</h1>
          <h2>Predicciones de Grupos</h2>
          <p>Predice los 3 mejores equipos de cada grupo</p>
        </div>
        
        <div className="login-content">
          {configError ? (
            <div className="config-error">
              <h3>⚠️ Error de Configuración</h3>
              <p>No se pudo cargar Google Sign-In. Posibles causas:</p>
              <ol style={{ textAlign: 'left', marginTop: '1rem' }}>
                <li><strong>Conexión a Internet:</strong> Verifica que tengas conexión a Internet</li>
                <li><strong>Bloqueador de anuncios:</strong> Desactiva extensiones que puedan bloquear scripts de Google</li>
                <li><strong>Configuración incorrecta:</strong> Verifica que tu Client ID en <code>.env.local</code> sea correcto</li>
                <li><strong>Firewall/Proxy:</strong> Asegúrate que no se bloquee <code>accounts.google.com</code></li>
              </ol>
              <p style={{ marginTop: '1rem' }}>
                <button onClick={() => window.location.reload()} style={{ 
                  padding: '10px 20px', 
                  fontSize: '16px', 
                  cursor: 'pointer',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}>
                  🔄 Intentar de nuevo
                </button>
              </p>
              <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                <strong>Tip para desarrolladores:</strong> Abre la consola del navegador (F12) para ver más detalles del error.
              </p>
            </div>
          ) : (
            <>
              <div style={{ position: 'relative', minHeight: '44px' }}>
                {loadingGoogle && (
                  <div className="loading-google">
                    <div className="spinner"></div>
                    <p>Cargando...</p>
                  </div>
                )}
                <div 
                  id="googleSignInButton" 
                  style={{ 
                    visibility: loadingGoogle ? 'hidden' : 'visible',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                ></div>
              </div>
              
              <div className="login-info">
                <h3>¿Cómo funciona?</h3>
                <ol>
                  <li>Inicia sesión con tu cuenta de Google</li>
                  <li>Selecciona los 3 mejores equipos para cada uno de los 12 grupos</li>
                  <li>Envía tus predicciones (no podrás editarlas después)</li>
                  <li>Ve tus puntos y predicciones en la página de resultados</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
