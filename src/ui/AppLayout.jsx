import { Outlet, useNavigation } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';
import Spinner from './Spinner';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading'; //* Ini dari React Router dan bersifat universal. Jika ada di app yg loading (fetct api data), maka state nya berubah

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Spinner />}

      <Header />

      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
