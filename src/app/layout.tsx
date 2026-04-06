import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Filip Csupka — DevOps / SRE / Kubernetes Engineer",
  description:
    "Senior DevOps & SRE Engineer specialising in Kubernetes, OpenShift, GitOps, ArgoCD and cloud-native infrastructure.",
  keywords: [
    "DevOps",
    "SRE",
    "Kubernetes",
    "OpenShift",
    "ArgoCD",
    "GitOps",
    "Terraform",
    "Platform Engineer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
