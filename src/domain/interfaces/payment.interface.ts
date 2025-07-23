import Stripe from 'stripe';

export interface PaymentService {
  createSession(
    config: Stripe.Checkout.SessionCreateParams,
  ): Promise<Stripe.Checkout.Session>;
}
