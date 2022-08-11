import bgImage from '@/assets/images/bg.jpg';

export default (props) => {

    const container = {
        background: `url(${bgImage}) center bottom / cover no-repeat`,
        height: '100vh'
    }

    return (
        <div style={container}>
            {props.children}
        </div>
    )
}