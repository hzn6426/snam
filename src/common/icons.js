import tfunction from '@/pages/tfunction';
import {
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    IdcardOutlined,
    TrophyOutlined,
    ApartmentOutlined,
    FileExclamationOutlined,
    DeploymentUnitOutlined,
    FlagOutlined,
    UserSwitchOutlined,
    UnorderedListOutlined,
    TableOutlined,
    FunnelPlotOutlined,
    FileTextOutlined,
    RobotFilled,
    RobotOutlined,
    OneToOneOutlined,
    SolutionOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    DollarOutlined,
    MergeCellsOutlined
} from '@ant-design/icons';

const icons = {
    user: <UserOutlined />,
    uset: <TeamOutlined />,
    role: <IdcardOutlined />,
    resource: <SettingOutlined />,
    position: <TrophyOutlined />,
    group: <ApartmentOutlined />,
    menu: <UnorderedListOutlined />,
    logger: <FileExclamationOutlined />,
    dictionary: <DeploymentUnitOutlined />,
    param: <FlagOutlined />,
    hmac: <UserSwitchOutlined />,
    hmacLog: <FileTextOutlined />,
    column: <TableOutlined />,
    limit: <FunnelPlotOutlined />,
    robot: <RobotFilled />,
    tenant: <RobotOutlined />,
    tmenu: <OneToOneOutlined />,
    tlog: <SolutionOutlined />,
    tfunction: <MergeCellsOutlined />,
};

export const iconEnum = (item) => {
    return icons[item];
};

export const iconList = () => {
    let newList = [];
    Object.keys(icons).forEach((item, index) => {
        newList.push({
            label: Object.values(icons)[index],
            value: item
        })
    })
    return newList;
}
