document.querySelectorAll("a").forEach((i, index1) => {
    i.addEventListener("click", e => {
        document.querySelectorAll("a").forEach((x, index2) => {
            if(index1 != index2) {
                x.style.fontWeight = 'normal';
                // x.style.borderBottom = 'none';
                x.style.color = 'black';
            }
        })
        e.target.style.fontWeight = 'bold';
        // e.target.style.borderBottom = '1px solid rgb(128, 176, 231)';
        e.target.style.color = 'rgb(128, 176, 231)';
    })
})

// document.querySelectorAll("a").forEach((i, index1) => {
//     i.addEventListener("mouseover", e => {
//         e.target.style.fontWeight = 'bold';
//         e.target.style.borderBottom = '2px solid rgb(128, 176, 231)';
//         e.target.style.color = 'rgb(128, 176, 231)';
//     })
// })