const getAllAvatar = () => {
    let avatars = [];
    for (let i = 1; i <= 20; i++) {
        avatars.push(`/img/avatars/picture_${i}.jpg`);
    }
    return avatars;
};

export default getAllAvatar;
