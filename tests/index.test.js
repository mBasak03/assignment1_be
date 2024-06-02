// tests/authController.test.js

const { describe, it, expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../index");

describe("Unit testing for auth controllers", () => {
    describe("POST /signup", () => {
        it("should return 200 and success message with JWT token for valid input", async () => {
            const res = await request(app).post("/api/v1/signup").send({
                username: "m_2003",
                password: "12345678",
                email: "abc@gmail.com",
                otp: "123456"
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "User registered successfully");
            expect(res.body).toHaveProperty("token");
        });

        it("should return 400 for missing fields", async () => {
            const res = await request(app).post("/api/v1/signup").send({
                username: "m_2003",
                password: "12345678"
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error", "Email is required");
        });

        it("should return 400 for invalid email format", async () => {
            const res = await request(app).post("/api/v1/signup").send({
                username: "m_2003",
                password: "12345678",
                email: "invalid-email",
                otp: "123456"
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error", "Invalid email format");
        });

        it("should return 409 for existing username or email", async () => {
            await request(app).post("/api/v1/signup").send({
                username: "existing_user",
                password: "12345678",
                email: "existing@gmail.com",
                otp: "123456"
            });

            const res = await request(app).post("/api/v1/signup").send({
                username: "existing_user",
                password: "12345678",
                email: "newemail@gmail.com",
                otp: "123456"
            });
            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty("error", "Username already exists");

            const res2 = await request(app).post("/api/v1/signup").send({
                username: "new_user",
                password: "12345678",
                email: "existing@gmail.com",
                otp: "123456"
            });
            expect(res2.status).toBe(409);
            expect(res2.body).toHaveProperty("error", "Email already exists");
        });
    });
});
