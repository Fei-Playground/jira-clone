export const AboutView = (): JSX.Element => {
  return (
    <div className="p-6">
      <h1 className="font-primary-black text-2xl">About</h1>
      <p className="mt-4 max-w-[600px] font-primary-light text-sm leading-6 text-font-subtle">
        Jira Clone is built by a small team of engineers and designers who use
        boards like this one every day. We kept the workspace deliberately
        simple — projects, issues, comments and a board that stays out of the
        way. There is no real sign-in, so pick any teammate on the login screen
        to see the same project from their side.
      </p>
    </div>
  );
};
