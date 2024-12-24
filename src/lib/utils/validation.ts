export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

export function formatCPFCNPJ(value: string): string {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (numbers.length <= 11) {
    return numbers.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      '$1.$2.$3-$4'
    );
  } else {
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
}

export function formatPhone(phone: string): string {
  const numbers = phone.replace(/[^\d]/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3'
    );
  } else if (numbers.length === 10) {
    return numbers.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      '($1) $2-$3'
    );
  }
  
  return phone;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
