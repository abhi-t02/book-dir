import { Request } from "express";

export interface authRequest extends Request {
  id: string;
}
