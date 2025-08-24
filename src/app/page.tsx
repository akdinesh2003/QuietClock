import { QuietClockPage } from "@/components/quiet-clock-page";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-blue-200/30 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-blue-900/40"></div>
      <QuietClockPage />
    </main>
  );
}
