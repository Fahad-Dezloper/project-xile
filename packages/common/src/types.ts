import {z} from 'zod'

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().includes("@"),
    name: z.string()
})

export const SignInSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().includes("@"),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})