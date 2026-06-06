import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./fitness.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Fitness Video Editing | Raees Visuals",
  description:
    "Done-for-you fitness video editing for coaches. YouTube and Instagram content — start to finish, every month.",
};

export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`fitness-page ${bebasNeue.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
