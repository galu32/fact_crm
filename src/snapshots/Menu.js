import { Person } from '@material-ui/icons';
import DashIcon from '@material-ui/icons/Dashboard';
// import RepoIcon from '@material-ui/icons/MenuBook';
// import ChatIcon from '@material-ui/icons/Chat';
// import RecordIcon from '@material-ui/icons/AccountBalance';
// import RoutineIcon from '@material-ui/icons/PlayCircleFilled';
// import ConfigIcon from '@material-ui/icons/Settings';
// import AccountIcon from '@material-ui/icons/AccountBox';

const MenuConfig = [
    {icon: DashIcon, to: '/', name: 'Dashboard'},
    {icon: Person, to: '/list/Customer', name: 'Clientes'},
    // {icon: ChatIcon, name: 'Conversaciones'},
    // // {icon: RecordIcon, to: '/list', name: 'Registros'/*, options: {
    //     'Factura de Compra': {},
    //     'Factura de Venta': {},
    //     'Clientes': {},
    //     'Proveedores': {},
    //     'Asientos': {},
    // // }*/},
    // // {icon: RepoIcon, name: 'Reportes'},
    // {icon: RoutineIcon, name: 'Rutinas'},
    // {icon: AccountIcon, name: 'Cuenta'},
    // {icon: ConfigIcon, name: 'Configuracion'}
];

export default MenuConfig;