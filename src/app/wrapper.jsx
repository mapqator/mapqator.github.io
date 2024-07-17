"use client";
import React from "react";
import GlobalContextProvider from "../contexts/GlobalContext";

export default function ParentProvider({ children }) {
	return <GlobalContextProvider>{children}</GlobalContextProvider>;
}
