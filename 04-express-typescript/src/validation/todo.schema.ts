import {z} from 'zod'

export const todoValidateSchema = z.object({
    id: z.string().describe('Id of the todo'),
    title: z.string().describe('title of the todo'),
    description: z.string().optional().describe('description for the todo'),
    isCompleted: z.boolean().default(false).describe('if the todo item is completed or not')
})

export type Todo = z.infer<typeof todoValidateSchema>

// export interface ITodo{
//     id: string
//     title: string
//     description?: string
//     isCompleted: boolean
// }