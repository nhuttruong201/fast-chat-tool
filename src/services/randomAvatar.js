const randomAvatar = () => {
    const numImg = Math.floor(Math.random() * 27) + 1;
    return `/img/avatars/picture_${numImg}.jpg`;
};

export default randomAvatar;
