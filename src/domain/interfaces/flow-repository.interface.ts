import { Flow } from '../entities/flow.entity';

export interface FlowRepository {
  create(flow: Flow): Promise<void>;
  findAll(): Promise<Flow[]>;
  findById(id: string): Promise<Flow | null>;
  update(flow: Flow): Promise<void>;
  delete(id: string): Promise<void>;
}
