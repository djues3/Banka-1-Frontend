import * as React from 'react';
import { AlertDialog } from '@base-ui-components/react/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/AxiosUser';
import { useTheme } from '@mui/material/styles';

const LogoutButton = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const logoSrc = theme.palette.mode === 'dark'
    ? "/logo-removebg-preview.png"
    : "/logo-removebg-invert.png";

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '16px',
      }}
    >
      <AlertDialog.Root>
        <AlertDialog.Trigger
          data-color="red"
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Logout
        </AlertDialog.Trigger>

        <AlertDialog.Portal>
          <AlertDialog.Backdrop
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              position: 'fixed',
              inset: 0,
              zIndex: 999,
            }}
          />
          <AlertDialog.Popup
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 12,
              padding: 24,
              width: 420,
              boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                width: '100%',
              }}
            >
              <img
                src={logoSrc}
                alt="Logo"
                style={{
                  maxWidth: '180px',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
              <AlertDialog.Title
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Are you sure you want to logout?
              </AlertDialog.Title>
            </div>

            <AlertDialog.Description
              style={{
                fontSize: 14,
                color: theme.palette.text.secondary,
                textAlign: 'center',
              }}
            >
              You can't undo this action.
            </AlertDialog.Description>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginTop: 16,
                width: '100%',
              }}
            >
              <AlertDialog.Close
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: 8,
                  backgroundColor: theme.palette.grey[400],
                  color: theme.palette.getContrastText(theme.palette.grey[400]),
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </AlertDialog.Close>
              <AlertDialog.Close
                data-color="red"
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: 8,
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Continue
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default LogoutButton;
