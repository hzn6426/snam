import {
    ApartmentOutlined,
    DeploymentUnitOutlined,
    FileExclamationOutlined,
    FileTextOutlined,
    FlagOutlined,
    FunnelPlotOutlined,
    IdcardOutlined,
    MergeCellsOutlined,
    OneToOneOutlined,
    RobotFilled,
    RobotOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    SolutionOutlined,
    TableOutlined,
    TeamOutlined,
    TrophyOutlined,
    UnorderedListOutlined,
    UserOutlined,
    UserSwitchOutlined,
    ThunderboltOutlined,
    NodeIndexOutlined
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
    order:<ShoppingCartOutlined />,
    action:<ThunderboltOutlined />,
    flow:<NodeIndexOutlined />
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
