import { uniqueTrainNames } from "@/utils/trainNames";
import { paths } from "@/utils/trainRoutes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}

      {/* Explore More Sections */}
      <div className="mt-16 space-y-16"></div>
    </div>
  );
}
