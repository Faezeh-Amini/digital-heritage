FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Digital Heritage/Digital Heritage.csproj", "Digital Heritage/"]
RUN dotnet restore "Digital Heritage/Digital Heritage.csproj"

COPY . .
WORKDIR "/src/Digital Heritage"
RUN dotnet publish "Digital Heritage.csproj" \
	--configuration Release \
	--output /app/publish \
	--no-restore \
	/p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Digital_Heritage.dll"]
