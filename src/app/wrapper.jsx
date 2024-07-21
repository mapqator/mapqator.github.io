"use client";
import React from "react";
import AuthContextProvider from "@/contexts/AuthContext";

export default function ParentProvider({ children }) {
	return <AuthContextProvider>{children}</AuthContextProvider>;
}
