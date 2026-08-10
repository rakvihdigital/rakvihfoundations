// src/app/api/teacher/apply/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs"; // 🚀 Import bcryptjs for hashing

// Helper function to generate a random password
function generateRandomPassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      subjects, 
      teaching_mode,
      qualification,
      experience_years,
      gender,
      date_of_birth,
      teacher_type,
      address,
      message
    } = body;

    // 1. Basic Backend Validation
    if (!name || !email || !phone || !subjects || !teaching_mode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🚀 Generate the plain text password
    const generatedPassword = generateRandomPassword();

    // 🚀 Hash the password securely (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 2. Insert into Supabase
    const { error } = await supabase
      .from("teachers")
      .insert({
        name,
        email,
        phone,
        subjects,
        teaching_mode,
        qualification: qualification || null,
        experience_years: experience_years ? parseInt(experience_years, 10) : 0,
        gender: gender || null,
        date_of_birth: date_of_birth || null,
        teacher_type: teacher_type || "part_time",
        address: address || null,
        // 🚀 Save the HASHED password to the database, NOT the plain text
        password_hash: hashedPassword, 
      });

    if (error) {
      console.error("Supabase insert error:", error);
      
      if (error.code === '23505') {
        if (error.message.includes('email')) {
          return NextResponse.json({ error: "Email already exists. Can't register one more time." }, { status: 409 });
        }
        if (error.message.includes('phone')) {
          return NextResponse.json({ error: "Phone number already exists. Can't register one more time." }, { status: 409 });
        }
        return NextResponse.json({ error: "Email or Phone number already exists." }, { status: 409 });
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 🚀 Send the PLAIN TEXT password to the frontend so they can copy it!
    return NextResponse.json(
      { 
        message: "Application submitted successfully",
        password: generatedPassword 
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error submitting teacher application:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}