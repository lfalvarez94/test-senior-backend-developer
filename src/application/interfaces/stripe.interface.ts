import Stripe from 'stripe';

export interface StripeService {
  createSession(
    config: Stripe.Checkout.SessionCreateParams,
  ): Promise<Stripe.Checkout.Session>;
}
