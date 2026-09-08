import type { Request, Response } from "express";
import { type Todo, todoValidateSchema } from "../../validation/todo.schema.js";

class TodoController {
  private _db: Todo[];

  constructor() {
    this._db = [];
  }

  public handleGetAllTodos(req: Request, res: Response) {
    const todos = this._db;
    return res.json({ todos });
  }

  public async handleInsertTodo(req: Request, res: Response) {
    try {
      const unValidated = req.body;
      const validationResult = await todoValidateSchema.parseAsync(unValidated);
      this._db.push(validationResult);
      return res
        .status(201)
        .json({ message: "Todo created successfully", todo: validationResult });
    } catch (e) {
      return res.status(400).json({ error: "Validation failed" });
    }
  }
}

export default TodoController;
