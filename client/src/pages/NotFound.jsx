import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container grid place-items-center min-h-[60vh] text-center">
      <div>
        <p className="text-7xl font-extrabold font-display bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-500">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </section>
  );
}