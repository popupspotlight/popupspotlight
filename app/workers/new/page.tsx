import WorkerSignupForm from './WorkerSignupForm'

export default function WorkerSignupPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Create your worker profile.
      </h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Highlight your experience so businesses know why you're a great fit before you
        even apply.
      </p>
      <div className="mt-8">
        <WorkerSignupForm />
      </div>
    </main>
  )
}
