import { Error404 } from "@app/components/error-404";

// Default route for the projects page - serves as the home fallback after 404
const DEFAULT_REDIRECT_PATH = "/projects";

// User-friendly message explaining the 404 error without technical jargon
const ERROR_MESSAGE = "We can't find the page you're looking for";

export default function NotFound404Route() {
  return (
    <div className="flex h-screen w-screen flex-center">
      <Error404 message={ERROR_MESSAGE} href={DEFAULT_REDIRECT_PATH} />
    </div>
  );
}
