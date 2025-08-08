export default function DashboardCard(props) {
  return (
    <div className={`w-70 h-40 rounded-md ${props.Color} flex flex-col justify-center items-center text-center`}>
      <h1 className="text-lg font-semibold">{props.title}</h1>
      <p className="text-2xl font-bold">{props.value}</p>
    </div>
  );
}

