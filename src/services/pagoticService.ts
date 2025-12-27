import { supabase } from './supabaseClient';

interface CreatePaymentRequest {
  publication_id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  return_url: string;
  cancel_url: string;
}

interface CreatePaymentResponse {
  success: boolean;
  payment_url?: string;
  transaction_id?: string;
  reference?: string;
  status?: string;
  transaction_db_id?: string;
  error?: string;
}

interface CreateSubscriptionRequest {
  publication_id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  return_url: string;
  cancel_url: string;
  interval?: 'monthly' | 'yearly';
}

interface CreateSubscriptionResponse {
  success: boolean;
  payment_url?: string;
  subscription_id?: string;
  reference?: string;
  status?: string;
  transaction_db_id?: string;
  error?: string;
}

interface TransactionStatus {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_url: string;
  reference: string;
  amount: number;
  currency: string;
  created_at: string;
  completed_at?: string;
}

export class PagoticService {
  /**
   * Crear un nuevo pago
   */
  static async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      console.log('Creando pago con datos:', request);
      
      const { data, error } = await supabase.functions.invoke('pagotic-create-payment', {
        method: 'POST',
        body: request,
      });

      if (error) {
        console.error('Error en createPayment:', error);
        return {
          success: false,
          error: error.message || 'Error desconocido',
        };
      }

      console.log('Pago creado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en createPayment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Crear una suscripción (alquiler)
   */
  static async createSubscription(request: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    try {
      console.log('Creando suscripción con datos:', request);
      
      const { data, error } = await supabase.functions.invoke('pagotic-create-subscription', {
        method: 'POST',
        body: request,
      });

      if (error) {
        console.error('Error en createSubscription:', error);
        return {
          success: false,
          error: error.message || 'Error desconocido',
        };
      }

      console.log('Suscripción creada exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en createSubscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtener estado de una transacción
   */
  static async getTransactionStatus(transactionId: string): Promise<TransactionStatus | null> {
    try {
      const { data, error } = await supabase
        .from('pagotic_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) {
        console.error('Error obteniendo estado de transacción:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo estado de transacción:', error);
      return null;
    }
  }

  /**
   * Obtener transacciones de un usuario
   */
  static async getUserTransactions(userId: string): Promise<TransactionStatus[]> {
    try {
      const { data, error } = await supabase
        .from('pagotic_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo transacciones del usuario:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo transacciones del usuario:', error);
      return [];
    }
  }

  /**
   * Cancelar un pago pendiente
   */
  static async cancelPayment(transactionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pagotic_transactions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) {
        console.error('Error cancelando pago:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error cancelando pago:', error);
      return false;
    }
  }
}
