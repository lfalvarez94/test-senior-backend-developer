import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from '../../application/interfaces/stripe.interface';

@Injectable()
export class StripeServiceImpl implements StripeService {
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  async createSession(
    config: Stripe.Checkout.SessionCreateParams,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create(config);
  }
}
