"use client";
import { useEffect, useState } from "react";
import { getGoogleMapsApiKey } from "@/api/base";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";
export default function GoogleMapWrapper({ children }) {
	const [loaded, setLoaded] = useState(false);
	const [googleMapsApiKey, setGoogleMapsApiKey] = useState(undefined);
	const { isAuthenticated } = useAuth();
	useEffect(() => {
		const key = getGoogleMapsApiKey();
		if (!loaded) {
			setGoogleMapsApiKey(key);
			setLoaded(true);
		}
	}, [isAuthenticated]);

	return <>{children}</>;
}
