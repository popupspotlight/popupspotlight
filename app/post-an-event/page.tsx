import PostEventForm from './PostEventForm'

export default function PostAnEventPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight max-w-xl">
        Post your event, let pop-ups come to you.
      </h1>
      <p className="mt-4 text-lg text-[var(--ink-soft)] max-w-xl">
        Describe what you're planning and businesses submit proposals — capped at 5 bids
        per event, so your inbox doesn't get overwhelmed. It's free to post.
      </p>
      <div className="mt-10">
        <PostEventForm />
      </div>
    </main>
  )
}
