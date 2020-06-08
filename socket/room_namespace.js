
exports.createNameSpace = (io) => {
		IO = io;
		nsp = io.of('/room');
		nsp.on('connection', socket => {
			let roomID = null;
			socket.on('create-room', (data) => {
				console.log('data :', data);
				socket.join(data);
				roomID = data;
			});

			// socket.on('connect-room', (roomId, fn) => {
			// 	console.log(roomId)
			// 	;
			// 	fn(true);
			// 	nsp.to(roomId).emit('start-video');
			// });
			socket.on('connect-room', function (data) {
				console.log('data :', data);
				socket.join(data);
				// socket.emit('connect')
				roomID = data;
				// nsp.to(roomID).emit('connect');
				nsp.to(roomID).emit('connect');
			});

			socket.on('compile-code', data => {
				nsp.to(roomID).emit('start-compiling');
				compileCode(data)
					.then(res => {
						console.log(res);
						nsp.to(roomID).emit('compile-output', res);						
					})
			});

			socket.on('send-room-info', data => {
				nsp.to(roomID).emit('room-info', data);
			});

			socket.on('set-enable-test', data => {
				nsp.to(roomID).emit('new-enable-test', data);
			});
			
			socket.on('send-full-error', data => {
				nsp.to(roomID).emit('new-full-error', data);
			});

			socket.on('set-new-current-task', data => {
				nsp.to(roomID).emit('new-current-task', data);
			});
			
			socket.on('code-changed', (data) => {
				nsp.to(roomID).emit('new-code', data);
			});

		});		
}