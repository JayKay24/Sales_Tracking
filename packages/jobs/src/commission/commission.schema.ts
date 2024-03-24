import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

type CommissionDocument = HydratedDocument<Commission>;

@Schema({ timestamps: true })
class Commission {
  @Prop({ required: true })
  agent_id: string;

  @Prop({ required: true })
  latestCommision: number;
}

const CommissionSchema = SchemaFactory.createForClass(Commission);

export { Commission, CommissionDocument, CommissionSchema };
