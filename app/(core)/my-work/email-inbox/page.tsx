export default function EmailInboxPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
        <h1 className="text-2xl font-semibold">Email Inbox</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your assigned emails.
        </p>
      </div>
    </div>
  );
}
