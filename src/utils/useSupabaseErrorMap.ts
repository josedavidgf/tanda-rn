export function mapSupabaseError(code: string): string {
  switch (code) {
    case 'invalid_login_credentials':
      return 'Correo o contraseña incorrectos';
    case 'user_already_registered':
      return 'Este usuario ya está registrado';
    case 'email_not_confirmed':
      return 'Debes confirmar tu correo antes de iniciar sesión';
    case 'invalid_email':
      return 'Formato de email inválido';
    case 'weak_password':
      return 'La contraseña es demasiado débil';
    case 'password_mismatch':
      return 'Las contraseñas no coinciden';
    default:
      return 'Ha ocurrido un error inesperado';
  }
}
