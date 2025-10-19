import { Link } from "react-router";

const NotFound = () => {
  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <div className="flex flex-col items-start text-start md:items-center md:text-center gap-8">
          <h1 className="title text-text-title">404</h1>
          <h2 className="subtitle text-text-default max-w-2xl">
            Страница не найдена
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-text-default max-w-xl">
            Кажется, вы забрели не туда. Но не переживайте — у нас ещё много
            вкусных специй и пряностей, которые ждут вас!
          </p>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn btn-primary mt-6"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
