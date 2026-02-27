export default function MyTasksPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your assigned tasks.
        </p>
      </div>
    </div>
  );
}
