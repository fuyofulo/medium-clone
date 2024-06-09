interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishDate: string;
}

const BlogCard = ({authorName, title, content, publishDate}: BlogCardProps) => {
    return <div>
        <div className="flex">
            <div className="flex justify-center flex-col"><Avatar name={authorName} /></div>
            <div className="font-extralight pl-2">{authorName}</div>
            <div className="pl-2 font-thin text-slate-500">{publishDate}</div>
        </div>  
        <div className="text-xl font-semibold"> {title} </div>
        <div className="text-md font-thin"> {content.slice(0, 100) + ' ....'}</div>
        <div className="w-full text-slate-500 text-sm font-thin"> {`${Math.ceil(content.length / 100)} minute(s) read`}</div>
        <div className="bg-slate-200 h-1 w-full"></div>
    </div>
}

export default BlogCard;

function Avatar ({ name }: { name: string }) {
    return <div className="relative inline-flex items-center justify-center w-4 h-4 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <span className="text-xs font-extralight text-gray-600 dark:text-gray-300">
            {name[0]}
        </span>
    </div>
}