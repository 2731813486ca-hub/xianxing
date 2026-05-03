import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
  name: z.string().min(1, "请输入昵称").max(30, "昵称最多30个字符"),
});

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

export const workSchema = z.object({
  title: z.string().min(1, "请输入作品标题").max(100, "标题最多100个字符"),
  description: z.string().max(1000, "描述最多1000个字符").default(""),
  productUrl: z.string().max(500, "链接最多500个字符").default(""),
  imageUrls: z
    .array(z.string())
    .min(1, "至少需要一张图片")
    .max(5, "最多5张图片"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "请输入昵称").max(30, "昵称最多30个字符"),
  bio: z.string().max(200, "个人标语最多200个字符").default(""),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WorkInput = z.infer<typeof workSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
