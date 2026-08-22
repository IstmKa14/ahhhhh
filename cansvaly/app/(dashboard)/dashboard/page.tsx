import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, LayoutGrid, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden h-4 w-px bg-border sm:inline-block" />
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              <Link
                href="/dashboard"
                className="font-medium text-foreground transition-colors"
              >
                All Boards
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-1.5 font-medium">
              <Plus size={16} />
              <span>New Board</span>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-10">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Workspace Boards
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your collaborative canvas boards
            </p>
          </div>
        </div>

        {/* Board Grid / Empty State */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LayoutGrid size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No boards yet
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Create your first whiteboard to start drawing and collaborating in real time with your team.
          </p>
          <Button size="sm" className="mt-6 gap-1.5 font-medium">
            <Plus size={16} />
            <span>Create your first board</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
