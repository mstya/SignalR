using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using SignalR.Models;

namespace SignalR.Hubs
{
    public class ChatHub : Hub
    {
        private static int COUNT_OF_EXCHANGING;

        private static readonly List<ExchangeModel> connections = new List<ExchangeModel>(); 

        public override Task OnConnected()
        {
            connections.Add(new ExchangeModel
            {
                ConnectionId = Context.ConnectionId
            });

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            ExchangeModel model = connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (model != null)
            {
                connections.Remove(model);
            }

            return base.OnDisconnected(stopCalled);
        }

        public void SendMsg(string name, string message)
        {
            Clients.All.recieveMsg(name, message);
        }

        public void ExchangeZ(string z)
        {
            if (connections.Count <= 1)
            {
                return;
            }

            if (COUNT_OF_EXCHANGING == connections.Count)
            {
                return;
            }

            COUNT_OF_EXCHANGING++;
            int connectionIndex = -1;
            for (int i = 0; i < connections.Count; i++)
            {
                if (connections[i].ConnectionId == this.Context.ConnectionId)
                {
                    connectionIndex = i;
                }
            }
            
            ExchangeModel sender = connections.First(x => x.ConnectionId == this.Context.ConnectionId);
            sender.Z = z;

            ExchangeModel reciever = connectionIndex == connections.Count - 1 || connections.Count == 1
                ? connections.First()
                : connections[connectionIndex + 1];

            if (sender.ConnectionId != reciever.ConnectionId)
            {
                this.Clients.Client(reciever.ConnectionId).recieveZ(sender.ConnectionId, sender.Z);
            }
        }
    }
}