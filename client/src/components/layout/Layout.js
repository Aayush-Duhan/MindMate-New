import NavBar from './NavBar';

const Layout = ({ user, children }) => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <NavBar user={user} />
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 