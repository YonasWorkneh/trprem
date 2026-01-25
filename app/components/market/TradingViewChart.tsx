"use client";

import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
}

// Convert coin symbol to TradingView format (e.g., BTC -> BINANCE:BTCUSDT)
function getTradingViewSymbol(symbol: string): string {
  const upperSymbol = symbol.toUpperCase();
  // Most crypto pairs on TradingView use BINANCE exchange
  // Format: BINANCE:SYMBOLUSDT
  return `BINANCE:${upperSymbol}USDT`;
}

declare global {
  interface Window {
    TradingView?: {
      widget: new (options: {
        autosize: boolean;
        symbol: string;
        interval: string;
        timezone: string;
        theme: string;
        style: string;
        locale: string;
        toolbar_bg: string;
        enable_publishing: boolean;
        allow_symbol_change: boolean;
        container_id: string;
        height: number;
        width: string;
        hide_side_toolbar: boolean;
        studies: unknown[];
      }) => unknown;
    };
  }
}

export default function TradingViewChart({ symbol, interval = "15" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<{ remove?: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
    containerRef.current.id = containerId;
    containerRef.current.innerHTML = "";

    // Cleanup previous widget
    if (widgetRef.current && typeof widgetRef.current.remove === "function") {
      try {
        widgetRef.current.remove();
      } catch (error) {
        // Ignore cleanup errors
      }
      widgetRef.current = null;
    }

    // Check if TradingView script is already loaded
    const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
    
    const initWidget = () => {
      if (window.TradingView && containerRef.current) {
        try {
          const widget = new window.TradingView.widget({
            autosize: true,
            symbol: getTradingViewSymbol(symbol),
            interval: interval,
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: false,
            container_id: containerId,
            height: 400,
            width: "100%",
            hide_side_toolbar: false,
            studies: [],
          });
          widgetRef.current = widget as { remove?: () => void };
        } catch (error) {
          console.error("Failed to initialize TradingView widget:", error);
        }
      }
    };

    if (existingScript) {
      // Script already exists, just initialize
      if (window.TradingView) {
        initWidget();
      } else {
        // Wait for script to load
        const loadHandler = () => {
          initWidget();
          existingScript.removeEventListener("load", loadHandler);
        };
        existingScript.addEventListener("load", loadHandler);
      }
    } else {
      // Create and load TradingView script
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (widgetRef.current && typeof widgetRef.current.remove === "function") {
        try {
          widgetRef.current.remove();
        } catch (error) {
          // Ignore cleanup errors
        }
        widgetRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  );
}
