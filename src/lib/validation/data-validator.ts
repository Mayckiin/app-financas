/**
 * Serviço de Validação Completa Anti-Bug
 * Garante integridade de todos os dados antes de salvar
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  /**
   * Valida uma transação antes de salvar
   */
  static validateTransaction(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Campos obrigatórios
    if (!data.amount || typeof data.amount !== 'number') {
      errors.push('Valor é obrigatório e deve ser um número');
    } else if (data.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    if (!data.date) {
      errors.push('Data é obrigatória');
    } else {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.push('Data inválida');
      }
    }

    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Tipo deve ser "income" ou "expense"');
    }

    if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
      errors.push('Categoria é obrigatória');
    }

    // Validação de parcelamento
    if (data.installments) {
      if (typeof data.installments !== 'number' || data.installments < 1) {
        errors.push('Número de parcelas inválido');
      }
      if (data.installments > 1 && data.type !== 'expense') {
        warnings.push('Parcelamento geralmente é usado apenas para despesas');
      }
      if (data.installments > 60) {
        warnings.push('Número de parcelas muito alto (>60)');
      }
    }

    // Validação de valores extremos
    if (data.amount > 1000000) {
      warnings.push('Valor muito alto (>R$ 1.000.000)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida um agendamento antes de salvar
   */
  static validateSchedule(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Campos obrigatórios
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('Título é obrigatório');
    }

    if (!data.date) {
      errors.push('Data é obrigatória');
    } else {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.push('Data inválida');
      } else {
        const now = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        
        if (date < now) {
          warnings.push('Data está no passado');
        }
        if (date > oneYearFromNow) {
          warnings.push('Data está muito distante (>1 ano)');
        }
      }
    }

    if (!data.type || !['lembrete', 'cobranca', 'tarefa', 'compromisso'].includes(data.type)) {
      errors.push('Tipo inválido');
    }

    if (data.value !== undefined) {
      if (typeof data.value !== 'number' || data.value < 0) {
        errors.push('Valor inválido');
      }
    }

    if (data.repeat && !['none', 'daily', 'weekly', 'monthly', 'yearly'].includes(data.repeat)) {
      errors.push('Tipo de repetição inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida formato de valores monetários
   */
  static validateMoneyFormat(value: any): boolean {
    if (typeof value !== 'number') return false;
    if (isNaN(value)) return false;
    if (!isFinite(value)) return false;
    if (value < 0) return false;
    return true;
  }

  /**
   * Valida formato de datas
   */
  static validateDateFormat(date: any): boolean {
    if (!date) return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }

  /**
   * Sanitiza string removendo caracteres perigosos
   */
  static sanitizeString(str: string): string {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  /**
   * Valida e corrige dados de transação
   */
  static sanitizeTransaction(data: any): any {
    return {
      ...data,
      amount: Math.abs(Number(data.amount) || 0),
      description: data.description ? this.sanitizeString(data.description) : undefined,
      category: this.sanitizeString(data.category),
      person: data.person ? this.sanitizeString(data.person) : undefined,
      installments: data.installments ? Math.max(1, Math.floor(Number(data.installments))) : undefined,
    };
  }

  /**
   * Valida e corrige dados de agendamento
   */
  static sanitizeSchedule(data: any): any {
    return {
      ...data,
      title: this.sanitizeString(data.title),
      description: data.description ? this.sanitizeString(data.description) : undefined,
      value: data.value !== undefined ? Math.abs(Number(data.value) || 0) : undefined,
      person: data.person ? this.sanitizeString(data.person) : undefined,
    };
  }
}
