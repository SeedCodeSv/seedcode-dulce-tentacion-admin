import logo from '../../assets/globo.png';

import { IContentBirthday } from './types/mobile-view.types';

function ParticipantList(props: IContentBirthday) {
  return (
    <div className="p-6 shadow-lg rounded-2xl border border-gray-100 w-full bg-transparent">
      <div className="space-y-4">
        {props.employee.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between bg-transparent p-4 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <img
                alt={`${participant.firstName} ${participant.firstLastName}`}
                className="w-12 h-12 rounded-full mr-4 border-2 border-blue-500"
                src="https://ps.w.org/cbxuseronline/assets/icon-256x256.png?rev=2284897"
              />
              <div className="text-blue-400">
                <p className="text-lg font-bold">
                  {participant.firstName} {participant.secondName}
                </p>
                <p className="text-md font-medium">
                  {participant.firstLastName} {participant.secondLastName}
                </p>
                <p className="text-sm dark:text-white ">FN: {participant.dateOfBirth}</p>
                <p className="text-sm dark:text-white ">Sucursal: {participant.branchName}</p>
              </div>
            </div>
            <div className="text-pink-500">
              <img alt="icon" className=" xl:flex w-10 h-10" src={logo} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParticipantList;
