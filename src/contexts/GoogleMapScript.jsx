"use client";
import { useEffect, useState } from "react";
import { getGoogleMapsApiKey } from "@/api/base";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";
export default function GoogleMapWrapper({ children }) {
	const [googleMapsApiKey, setGoogleMapsApiKey] = useState(undefined);
	const { isAuthenticated } = useAuth();
	useEffect(() => {
		setGoogleMapsApiKey(getGoogleMapsApiKey());
	}, [isAuthenticated]);

	return (
		<LoadScript googleMapsApiKey="AIzaSyA8FR4zPdFgUNu4Rr_iuMYgcOb6gCCr21M">
			{children}
		</LoadScript>
	);
	return <>{children}</>;
	return googleMapsApiKey ? (
		<LoadScript googleMapsApiKey={googleMapsApiKey}>{children}</LoadScript>
	) : googleMapsApiKey !== undefined ? (
		<LoadScript>{children}</LoadScript>
	) : (
		<>{children}</>
	);
}